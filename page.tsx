'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LinkIcon, CheckCircle, XCircle } from 'lucide-react'
import { checkUrls } from './actions'
import { Progress } from "@/components/ui/progress"

interface UrlStatus {
  url: string
  title: string | null
  status: number
  error: string | null
}

export default function UrlConverter() {
  const [input, setInput] = useState('')
  const [links, setLinks] = useState<string[]>([])
  const [checkedLinks, setCheckedLinks] = useState<UrlStatus[]>([])
  const [visitedLinks, setVisitedLinks] = useState<Set<number>>(new Set())
  const [isChecking, setIsChecking] = useState(false)
  const [progress, setProgress] = useState(0)

  const convertUrls = () => {
    const urls = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(url => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`
        }
        return url
      })
    setLinks(urls)
    setCheckedLinks([])
    setProgress(0)
  }

  const checkAllUrls = async () => {
    setIsChecking(true)
    setProgress(0)
    for (let i = 0; i < links.length; i++) {
      const result = await checkUrls([links[i]])
      setCheckedLinks(prev => [...prev, result[0]])
      setProgress(((i + 1) / links.length) * 100)
    }
    setIsChecking(false)
  }

  const handleLinkClick = (index: number) => {
    setVisitedLinks(new Set(visitedLinks).add(index))
  }

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status >= 300 && status < 400) return <CheckCircle className="h-5 w-5 text-yellow-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="elegant-shadow">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900">URL 转换检测工具</CardTitle>
            <p className="mt-2 text-xl text-gray-600">快速转换和检查多个URL的状态和标题</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-inner">
              <p className="text-gray-700 mb-2">使用说明：</p>
              <p className="text-gray-600 text-sm">1. 输入网址（每行一个，无需添加 http:// 或 https://）</p>
              <p className="text-gray-600 text-sm">2. 点击"转换"生成链接</p>
              <p className="text-gray-600 text-sm">3. 点击"检查所有链接"验证可访问性</p>
            </div>
            <Textarea
              placeholder="example.com&#10;github.com&#10;vercel.com"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] font-mono text-gray-700 border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            />
            <div className="flex gap-4">
              <Button onClick={convertUrls} className="flex-1 bg-gray-800 text-white hover:bg-gray-700">
                转换
              </Button>
              <Button 
                onClick={checkAllUrls} 
                disabled={isChecking || links.length === 0}
                className="flex-1 bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-300"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    检查中...
                  </>
                ) : (
                  '检查所有链接'
                )}
              </Button>
            </div>
            {isChecking && (
              <Progress value={progress} className="h-2 bg-gray-200" />
            )}
            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(index)}
                      className={`text-lg hover:underline ${
                        visitedLinks.has(index) ? 'text-purple-600' : 'text-blue-600'
                      }`}
                    >
                      {link}
                    </a>
                  </div>
                  {checkedLinks[index] && (
                    <div className="ml-8 text-sm flex items-center gap-2">
                      {checkedLinks[index].error ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        getStatusIcon(checkedLinks[index].status)
                      )}
                      <span className="text-gray-700">
                        {checkedLinks[index].error ? checkedLinks[index].error : `状态: ${checkedLinks[index].status}`}
                      </span>
                      {!checkedLinks[index].error && (
                        <>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-700">
                            标题: {checkedLinks[index].title || '无标题'}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 程一雄. 版权所有。</p>
          <p>微信: hym2108</p>
        </footer>
      </div>
    </div>
  )
}

