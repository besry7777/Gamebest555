// ฟังก์ชันนี้จะรันบน Server ของ Netlify
exports.handler = async (event, context) => {
    const { url } = JSON.parse(event.body);
    
    // ตรงนี้คือจุดที่คุณจะนำ Library เช่น ytdl-core มาประมวลผล
    // เพื่อให้การศึกษาเห็นภาพชัดเจน นี่คือ Workflow ของการไหลของข้อมูล
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "API เชื่อมต่อสำเร็จ", videoUrl: url }),
    };
};

