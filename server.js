require("coffee-script");
var parser = require("cliparser");
	args   = parser.parse(process.argv, {
		"-v": "--version",
		"-h": "--help",
		"-c": "--compile",
		"-p": "--port",
		"-a": "--address",
		"-s": "--static",
		"-l": "--location"
	})["doubledash"];

if (args.version) {
	var info = require("./package.json")
	console.log(info.version);
} else if (args.help) {
	var info = require("./package.json");
	require("./server/help")(info)
} else {
	var Compiler = null, Static = null;
	if (args.compile) {
		var location = args.location || "./public/js/g.js"
		Compiler = require("./server/compiler");
		Compiler.compile(location);
		if (args.location) return;
	}
	if (args.static) {
		var data = {};
		data.address = args.address || process.env.IP || "localhost"
		data.port    = args.port || process.env.PORT || "8080"

		var Static = require("./server/static"),
			server = new Static(data);
		if (Compiler !== null) server.connect(Compiler);
		server.start()
	}
}
