# Destination Images

Add your destination images here organized by region.

## Folder Structure:

```
destinations/
├── south-india/
│   ├── chennai.jpg
│   ├── ooty.jpg
│   ├── munnar.jpg
│   └── ...
├── north-india/
│   ├── jaipur.jpg
│   ├── manali.jpg
│   ├── shimla.jpg
│   └── ...
└── international/
    ├── dubai.jpg
    ├── singapore.jpg
    └── ...
```

## Image Naming Convention:
- Use lowercase
- Replace spaces with hyphens
- Use .jpg or .png format
- Recommended size: 400x300 pixels minimum

## Examples:
- `chennai.jpg`
- `araku-valley.jpg`
- `new-delhi.jpg`
- `jim-corbett.jpg`

## Then update DestinationSelection.jsx:
After adding images, update the image paths in the destination data from:
```javascript
image: 'https://images.unsplash.com/...'
```
To:
```javascript
image: '/src/assets/destinations/south-india/chennai.jpg'
```
