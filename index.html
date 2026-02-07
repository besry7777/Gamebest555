<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>EXIF Viewer</title>
<style>
    body {
        font-family: system-ui, sans-serif;
        background: #111;
        color: #fff;
        padding: 20px;
    }
    img {
        max-width: 100%;
        margin-top: 15px;
        border-radius: 10px;
    }
    .box {
        background: #1c1c1c;
        padding: 15px;
        border-radius: 10px;
        margin-top: 15px;
        white-space: pre-wrap;
        font-size: 14px;
    }
    input {
        margin-top: 10px;
    }
</style>
</head>
<body>

<h2>📸 EXIF Viewer (Read Only)</h2>
<input type="file" accept="image/*" id="upload">

<img id="preview">
<div class="box" id="exif">ยังไม่ได้เลือกรูป</div>

<!-- EXIF Library -->
<script src="https://cdn.jsdelivr.net/npm/exif-js"></script>

<script>
document.getElementById('upload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const img = document.getElementById('preview');
    img.src = URL.createObjectURL(file);

    img.onload = function () {
        EXIF.getData(img, function () {
            let output = '';
            const tags = EXIF.getAllTags(this);

            if (Object.keys(tags).length === 0) {
                output = '❌ ไม่พบข้อมูล EXIF ในรูปนี้';
            } else {
                for (let key in tags) {
                    output += `${key}: ${tags[key]}\n`;
                }
            }
            document.getElementById('exif').textContent = output;
        });
    };
});
</script>

</body>
</html>