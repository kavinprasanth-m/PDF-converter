const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

//const upload = multer({ dest: "uploads/" });

const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("File too large (Max 10MB)");
    }
    next(err);
});

app.post("/convert", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const inputPath = req.file.path;
    const outputDir = path.join(__dirname, "outputs");

    // Convert using LibreOffice
   // const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
      
       const command = `soffice --headless --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --norestore --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
   
      exec(command, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Conversion failed");
        }

        // Get output file
        const files = fs.readdirSync(outputDir);
        const pdfFile = files.find(file => file.endsWith(".pdf"));

        if (!pdfFile) {  
            return res.status(500).send("PDF not generated");
        }

        const pdfPath = path.join(outputDir, pdfFile);

        res.download(pdfPath, "converted.pdf", () => {
            // Cleanup
            fs.unlinkSync(inputPath);
            fs.unlinkSync(pdfPath);
        });
    });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// app.listen(5000, () => {
//     console.log("Server running on http://localhost:5000");
// });

app.get("/", (req, res) => {
    res.send("Server is running ✅");
});