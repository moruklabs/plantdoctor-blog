import { Badge } from '@/components/atoms/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TagCloudProps {
  tags: string[]
}

export function TagCloud({ tags }: TagCloudProps) {
  return (
    <aside className="py-12">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
