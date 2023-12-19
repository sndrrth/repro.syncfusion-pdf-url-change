import fs from "fs";

copySyncFusionPdfViewerResources();

function copySyncFusionPdfViewerResources() {
	const pkgPath = "./node_modules/@syncfusion/ej2-pdfviewer/package.json";
	const pkg = JSON.parse(fs.readFileSync(pkgPath, { encoding: "utf-8" }));

	if (fs.existsSync("./public/ej2-pdfviewer-lib")) {
		fs.rmdirSync("./public/ej2-pdfviewer-lib", { recursive: true });
	}

	fs.cpSync(
		"./node_modules/@syncfusion/ej2-pdfviewer/dist/ej2-pdfviewer-lib/",
		`./public/ej2-pdfviewer-lib/${pkg.version}/`,
		{ recursive: true },
	);
}
