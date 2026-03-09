import pandas as pd
import json

xl = pd.ExcelFile(r'c:\Users\Felipe\Desktop\Project_fit\Entrenamiento.xlsx')
df = xl.parse(xl.sheet_names[0])
res = {}

for _, r in df.iterrows():
    ex = r['Unnamed: 1']
    tr = r['Unnamed: 2']
    intn = r['Unnamed: 3']
    if pd.notna(ex) and str(ex).strip() != 'Ejecicio':
        res[str(ex).strip()] = {
            'trabajo': str(tr).strip() if pd.notna(tr) else '',
            'intensidad': str(intn).strip() if pd.notna(intn) else ''
        }
        
print(json.dumps(res, ensure_ascii=False, indent=2))
