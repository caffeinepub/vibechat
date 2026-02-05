import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { mockSponsoredItems, SponsoredVideoItem } from './mockSponsoredItems';
import { SponsoredVideoViewer } from './SponsoredVideoViewer';
import { useState } from 'react';

export function SponsoredVideoFeed() {
  const [selectedItem, setSelectedItem] = useState<SponsoredVideoItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const handleItemClick = (item: SponsoredVideoItem) => {
    setSelectedItem(item);
    setViewerOpen(true);
  };

  const handleViewerClose = (open: boolean) => {
    setViewerOpen(open);
    if (!open) {
      setTimeout(() => setSelectedItem(null), 200);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSponsoredItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative aspect-[9/16] bg-muted overflow-hidden">
              <img
                src={item.thumbnailPath}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 bg-yellow-500/90 text-black hover:bg-yellow-500"
              >
                Sponsored
              </Badge>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-8 w-8 text-black ml-1" fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-3 right-3 text-xs text-white bg-black/60 px-2 py-1 rounded">
                {item.duration}s
              </div>
            </div>

            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <SponsoredVideoViewer
        item={selectedItem}
        open={viewerOpen}
        onOpenChange={handleViewerClose}
      />
    </>
  );
}
