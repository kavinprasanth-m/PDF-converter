function triggerFile() {
    document.getElementById("fileInput").click();
}

function showFileName() {
    const file = document.getElementById("fileInput").files[0];
     const box = document.querySelector(".upload-box");

    if (file) {
        document.getElementById("uploadText").innerText = "Selected File:";
        document.getElementById("fileName").innerText = file.name;
        box.classList.add("active");
    }
}

function convert() {
    const file = document.getElementById("fileInput").files[0];
    const status = document.getElementById("status");

    if (!file) {
        alert("Please select a file");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
    alert("File size must be less than 10MB");
    return;
}

    status.innerText = "Uploading & Converting... ⏳";

    const formData = new FormData();
    formData.append("file", file);

    fetch("/convert", {
        method: "POST",
        body: formData
    })
    .then(res => res.blob())
    .then(blob => {
        status.innerText = "Download ready ✅";

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.pdf";
        a.click();
    })
    .catch(() => {
        status.innerText = "Conversion failed ❌";
    });
}