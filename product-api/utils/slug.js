function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/đ/g, "d")   // xử lý chữ đ
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

module.exports = generateSlug;