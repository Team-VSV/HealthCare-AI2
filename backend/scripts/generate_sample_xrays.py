import os
from PIL import Image, ImageDraw, ImageFilter

def create_mock_xray(path, is_pneumonia=False):
    # Create a 224x224 dark grayscale base image
    img = Image.new('RGB', (224, 224), color=(10, 10, 15))
    draw = ImageDraw.Draw(img)
    
    # Draw lungs outlines (two large dark areas)
    # Left lung
    draw.ellipse([30, 45, 100, 190], fill=(18, 18, 22), outline=(45, 45, 55), width=2)
    # Right lung
    draw.ellipse([124, 45, 194, 190], fill=(18, 18, 22), outline=(45, 45, 55), width=2)
    
    # Draw spine (vertical bone structure in center)
    draw.line([112, 20, 112, 200], fill=(160, 160, 170), width=8)
    for y in range(30, 200, 15):
        draw.line([105, y, 119, y], fill=(180, 180, 190), width=4)
        
    # Draw clavicles (shoulder bones)
    draw.arc([20, 20, 112, 60], start=180, end=300, fill=(160, 160, 170), width=4)
    draw.arc([112, 20, 204, 60], start=240, end=360, fill=(160, 160, 170), width=4)
    
    # Draw ribs (curved lines across lungs)
    for y in range(60, 180, 20):
        # Left ribs
        draw.arc([10, y-10, 112, y+30], start=160, end=270, fill=(110, 110, 120), width=2)
        # Right ribs
        draw.arc([112, y-10, 214, y+30], start=270, end=20, fill=(110, 110, 120), width=2)
        
    # If pneumonia, draw cloudy infiltrates (white patchy areas inside the lungs)
    if is_pneumonia:
        # Create a separate layer for blending to make it look cloudy
        overlay = Image.new('RGB', (224, 224), color=(0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        # Draw some soft white circles (patchy consolidation)
        overlay_draw.ellipse([45, 80, 85, 120], fill=(150, 150, 160))
        overlay_draw.ellipse([50, 130, 90, 175], fill=(160, 160, 170))
        overlay_draw.ellipse([135, 100, 180, 150], fill=(140, 140, 150))
        
        # Apply Gaussian blur to the overlay to make it look like a real soft cloud/infiltrate
        overlay = overlay.filter(ImageFilter.GaussianBlur(radius=10))
        
        # Add the blurred overlay to the original image
        img = Image.blend(img, overlay, alpha=0.55)
        
    # Apply a light global blur to make it look like an authentic analog X-Ray scan
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    
    # Save the image
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, format='JPEG', quality=95)
    print(f"Saved mock X-ray to {path}")

if __name__ == "__main__":
    public_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'samples')
    create_mock_xray(os.path.join(public_dir, 'normal.jpg'), is_pneumonia=False)
    create_mock_xray(os.path.join(public_dir, 'pneumonia.jpg'), is_pneumonia=True)
