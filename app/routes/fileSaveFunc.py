import os
from werkzeug.utils import secure_filename
from datetime import datetime

def save_and_get_filepath(file_obj, upload_dir="uploads", allowed_extensions=None):
    """
    Сохраняет файл на сервер и возвращает его путь в виде строки.
    
    Args:
        file_obj: Объект файла из request.files
        upload_dir: Директория для сохранения (по умолчанию "uploads")
        allowed_extensions: Список разрешенных расширений (None - все разрешены)
    
    Returns:
        str: Путь к сохраненному файлу в формате "uploads/filename.ext"
        None: Если произошла ошибка
    """
    # 1. Проверка наличия файла
    if not file_obj or file_obj.filename == "":
        return None

    # 2. Проверка расширения файла
    file_ext = os.path.splitext(file_obj.filename)[1].lower()
    if allowed_extensions and file_ext not in allowed_extensions:
        return None

    # 3. Создание директории, если не существует
    os.makedirs(upload_dir, exist_ok=True)

    # 4. Генерация безопасного имени файла
    original_name = secure_filename(file_obj.filename)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{os.path.splitext(original_name)[0]}_{timestamp}{file_ext}"
    
    # 5. Сохранение файла
    filepath = os.path.join(upload_dir, filename)
    try:
        file_obj.save(filepath)
        # Возвращаем путь в виде строки VARCHAR (например "uploads/file_20240625_123456.txt")
        return filepath.replace("\\", "/")  # Унифицируем разделители для Windows/Linux
    except Exception as e:
        print(f"Ошибка сохранения файла: {e}")
        return None
