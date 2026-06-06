from sklearn.datasets import fetch_openml
print("Fetching dataset...")
try:
    data = fetch_openml(name='cardiovascular-disease', version=1, as_frame=True, parser='auto')
    df = data.frame
    print("Shape:", df.shape)
    print("Columns:", df.columns.tolist()[:15])
except Exception as e:
    print("Error:", e)
