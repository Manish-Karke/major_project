'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const placeholderResult = `
IELTS Essay Evaluation:

Task Achievement: 7.5
Coherence and Cohesion: 7.0
Lexical Resource: 8.0
Grammatical Range and Accuracy: 7.5

Overall Band Score: 7.5

Comments:
- Well-developed response with relevant ideas
- Good use of cohesive devices
- Wide range of vocabulary with some sophisticated words
- Generally well-structured sentences with minor errors

Areas for Improvement:
- Strengthen the conclusion
- Improve paragraph transitions
- Reduce minor grammatical errors
`

export default function IELTSEssayEvaluator() {
  const [essay, setEssay] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulating API call with a timeout
    setTimeout(() => {
      setResult(placeholderResult)
      setIsLoading(false)
    }, 2000)
  }

  return (
    (<div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>IELTS Essay Evaluator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Paste your IELTS essay here..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              rows={10}
              className="mb-4" />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Evaluating...' : 'Evaluate Essay'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Evaluation Result:</h3>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
              {result || placeholderResult}
            </pre>
          </div>
        </CardFooter>
      </Card>
    </div>)
  );
}

