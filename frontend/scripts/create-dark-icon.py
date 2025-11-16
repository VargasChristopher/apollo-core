#!/usr/bin/env python3
"""
Create an apple-touch-icon with white logo on #2f2f2f background
"""

from PIL import Image, ImageDraw

# Load the light logo (white/light colored)
logo = Image.open('assets/images/apollo-logo-light.png').convert('RGBA')

# Create a new 180x180 image with #2f2f2f background
size = 180
background_color = (47, 47, 47, 255)  # #2f2f2f
icon = Image.new('RGBA', (size, size), background_color)

# Resize logo to fit nicely (leave some padding)
logo_size = int(size * 0.7)  # 70% of icon size
logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

# Calculate position to center the logo
x = (size - logo_size) // 2
y = (size - logo_size) // 2

# Paste the logo onto the background
icon.paste(logo_resized, (x, y), logo_resized)

# Save the result
icon.save('assets/images/apple-touch-icon-dark.png', 'PNG')
print("✓ Created apple-touch-icon-dark.png (180x180, white logo on #2f2f2f)")

# Also create larger versions for the manifest
for size in [192, 512]:
    icon_large = Image.new('RGBA', (size, size), background_color)
    logo_size = int(size * 0.7)
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    x = (size - logo_size) // 2
    y = (size - logo_size) // 2
    icon_large.paste(logo_resized, (x, y), logo_resized)
    icon_large.save(f'assets/images/apollo-icon-dark-{size}.png', 'PNG')
    print(f"✓ Created apollo-icon-dark-{size}.png ({size}x{size}, white logo on #2f2f2f)")
