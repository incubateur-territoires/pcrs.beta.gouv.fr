# sync-pcrs-projects

Synchronise une base airtable depuis un CSV.

## Installation

Créer un environnement virtuel:

```bash
python -m venv venv
```

Activer l'environnement virtuel:

```bash
source venv/bin/activate # Linux
venv\Scripts\activate # Windows
```

Installer les dépendances:

```bash
pip install -r requirements.txt
```

## Configuration

Créer un fichier `.env` à la racine du projet:

```bash
cp .env.example .env
```

Modifier les variables d'environnement dans le fichier `.env`:

```py
GRIST_ACCESS_TOKEN="your_grist_access_token"
GRIST_DOCUMENT_ID="your_grist_document_id"
GRIST_TABLE_NAME="your_grist_table_name"

PIVOT_COLUMN="your_joint_key" # La clé permettant de faire la jointure entre les deux tables
COLUMNS_TO_CHECK="your,columns,to,check" # Les colonnes à vérifier pour savoir si une ligne doit être mise à jour

CSV_EXPORT_URL="your_csv_export_url" # Un lien vers un fichier CSV
```

## Utilisation

Lancer le script:

```bash
python src/sync.py
```
