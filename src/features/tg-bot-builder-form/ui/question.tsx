import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Button } from '@/components/ui/button.tsx'

export const Question = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CardTitle</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>

      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
