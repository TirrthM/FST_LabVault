# Dynamic OG (Open Graph) Image Generation

## Overview

LabVault implements dynamic Open Graph image generation using the `@vercel/og` library with Next.js App Router Route Handlers. This enables rich social-media preview cards for every equipment asset shared via URL.

## Technical Architecture

```
GET /api/og/equipment/[id]
  ↓
Route Handler receives dynamic `id` parameter
  ↓
Repository fetches EquipmentItem from mock-db
  ↓
JSX template renders equipment details as visual card
  ↓
@vercel/og ImageResponse converts JSX to PNG (1200 × 630)
  ↓
Response returned with correct Content-Type and cache headers
```

## Implementation

### Route Definition

```
src/app/api/og/equipment/[id]/route.tsx
```

This file exports a `GET` handler:

```typescript
import { ImageResponse } from "@vercel/og";
import { repository } from "@/data/repository";

export const runtime = "edge"; // Edge runtime for fast response

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const equipment = await repository.equipment.findById(params.id);
  // ... renders ImageResponse JSX
}
```

### Visual Card Design

The generated image includes:
- **LabVault** brand header with a laboratory flask icon
- **Equipment name** in large, bold typography
- **Asset ID** and **Serial Number**
- **Status badge** with contextual colour (green for Available, amber for Under Maintenance, etc.)
- **Condition** and **Lab assignment**
- **Model & manufacturer** metadata
- Gradient background (`hsl(222.2 47.4% 11.2%)` → `hsl(217.2 32.6% 17.5%)`) consistent with the app dark theme

### Dimensions

| Property      | Value     |
|---------------|-----------|
| Width         | 1200 px   |
| Height        | 630 px    |
| Format        | PNG       |

### Edge Runtime

Using `export const runtime = "edge"` ensures minimal cold-start latency (< 50 ms typical), making OG images suitable for social crawlers with tight timeout budgets.

## Usage in Meta Tags

Equipment detail pages reference the OG image in their `generateMetadata` export:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const equipment = await repository.equipment.findById(params.id);
  return {
    title: `${equipment.name} — LabVault`,
    description: `${equipment.name} (${equipment.assetId}) in ${equipment.labId}`,
    openGraph: {
      images: [`/api/og/equipment/${params.id}`],
    },
  };
}
```

## Caching Strategy

- The `ImageResponse` sets `Cache-Control: public, max-age=86400` (24 hours)
- Subsequent requests within the TTL are served from CDN cache
- Equipment mutations (status changes, transfers) do not invalidate the cache automatically in Assignment 1; future work can implement `revalidateTag`

## Considerations

1. **Font Loading**: The current implementation uses system fonts. A production deployment could load custom WOFF2 fonts via `fetch` for brand consistency.
2. **Error Handling**: If an equipment ID is not found, the handler returns a generic fallback image with a "Not Found" message.
3. **Assignment 2 Extension**: When Prisma is integrated, the repository call remains identical — only the underlying data source changes.
