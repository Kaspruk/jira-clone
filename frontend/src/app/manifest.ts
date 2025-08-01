import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    "name": "Jira Clone",
    "short_name": "Jira Clone",
    "description": "Modern Jira clone for project and task management",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0000001F",
    "theme_color": "#1F1F1F",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "en",
    "categories": ["productivity", "business"],
    "icons": [
      {
        "src": "/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/apple-touch-icon.png",
        "sizes": "180x180",
        "type": "image/png"
      }
    ],
    "shortcuts": [
      {
        "name": "Projects",
        "short_name": "Projects",
        "description": "View all projects",
        "url": "/dashboard",
        "icons": [
          {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192"
          }
        ]
      },
      {
        "name": "Tasks",
        "short_name": "Tasks",
        "description": "View all tasks",
        "url": "/dashboard/tasks",
        "icons": [
          {
            "src": "/web-app-manifest-192x192.png",
            "sizes": "192x192"
          }
        ]
      }
    ]
  } ;
}