import zipfile
import os

os.chdir('/workspace/projects/public')
zf = zipfile.ZipFile('ai-startup-scout.zip', 'w', zipfile.ZIP_DEFLATED)
for root, dirs, files in os.walk('extension'):
    for f in files:
        path = os.path.join(root, f)
        arcname = path.replace('extension/', '')
        zf.write(path, arcname)
zf.close()
print('zip created successfully')