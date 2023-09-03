((ATA)=>{
	const Typescript = require("typescript");
	const inspector = require("inspector");
	const express = require("express");
	const Terser = require("terser");
	const http = require("http");
	const sass = require("sass");
	const Ejs = require("ejs");
	
	const port = 8587;
	
	const app = express();
	
	const GenerateRenderData = ()=>{
		const resp = {};
		
		resp.ws = ATA.Path.parse(inspector.url());
		resp.port = port;
		return resp;
	};
	
	const CompileJS = async(content, data)=>{
		const _pEJS = true;
		const _pTS = true;
		const _pTR = true;
		
		const typescript_options = {
			compilerOptions: {
				// tsconfig.json content
				esModuleInterop: false,
				sourceMap: true,
				inlineSources: true,
			}
		};
		const terser_options = {
			sourceMap: true,
			//toplevel: true,
		};
		
		if (_pEJS) {
			try {
				content = Ejs.render(content, { ...data });
			} catch (e) {
				console.log("EJS Render Error => ", e);
			}
		}
		
		if (_pTS) {
			try {
				content = Typescript.transpileModule(content, typescript_options).outputText; // typescript
			} catch (e) {
				console.log("TypeScript Transpile Error => ", e);
			}
		}
		
		if (_pTR) {
			try {
				const terserobj = await Terser.minify(content, terser_options);
				content = terserobj.code; // terser minify
			} catch (e) {
				console.log("Terser Minify Error => ", e);
			}
		}
		
		return content;
	};
	
	const CompileCSS = async(content, data)=>{
		const _pEJS = true;
		const _pSASS = true;
		const sass_options = {
			outputStyle: "compressed",
			data: ""
		};
		if (_pEJS) {
			try {
				content = Ejs.render(content, { ...data });
			} catch (e) {
				console.log("EJS Render Error => ", e);
			}
		}
		if (_pSASS) {
			try {
				const sassobj = sass.renderSync(Object.assign(sass_options, {
					data: content,
				}));
				content = sassobj.css;
			} catch (e) {
				console.log("SASS Render Error => ", e);
			}
		}
		return content;
	};
	
	
	const javascript_frontend_file_path = ATA.Path.join(ATA.CWD, "./www/assets/js.ejs");
	app.get("/assets/js/javascript2.js", async(req, res, next)=>{
		const renderData = {
			data: Object.assign({
				body: req.body,
				query: req.query,
				params: req.params,
			}, GenerateRenderData()),
			data2: Object.assign({
				ATA,
			}),
			
		};
		ATA.FS.readFile(javascript_frontend_file_path, "utf8", async (err, content) => {
			if(err)return next();
			CompileJS(content, renderData).then((code)=>{
				res.set("Content-Type", "text/javascript");
				res.status(200).send(code);
			});
		});
	});
	
	
	const css_frontend_file_path = ATA.Path.join(ATA.CWD, "./www/assets/css.ejs");
	app.get("/assets/css/style2.css", async (req, res, next) => {
		const renderData = {
			data: Object.assign({
					body: req.body,
					query: req.query,
					params: req.params,
				}, GenerateRenderData()),
			data2: Object.assign({
					ATA,
				}),
			
		};
		ATA.FS.readFile(css_frontend_file_path, "utf8", async (err, content) => {
			if (err) return next();
			CompileCSS(content, renderData).then((code) => {
				res.set("Content-Type", "text/css");
				res.status(200).send(code);
			});
		});
	});
	
	app.use(express.static(ATA.Path.join(ATA.CWD, "./www/")));
	
	const server = http.createServer(app);
	
	inspector.open(port);
	server.listen(port);
	
	console.log("You can visit http://localhost:" + port + "/");
	console.log("If you see this message on Inspector on Google Dev Tools");
	
})(require("ata.js")());