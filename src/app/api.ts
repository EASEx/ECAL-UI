const openSocket = (url: string, updateActions: (url: string) => void) => {
    const sseSource = new EventSource(url)
    sseSource.addEventListener('action', (ev: MessageEvent) => {
    })
}

export default openSocket