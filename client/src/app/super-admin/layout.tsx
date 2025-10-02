'use client'

import { useState } from "react"

function SuperAdminLayout({children}: {children : React.ReactNode} ) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-background">
            <div></div>
        </div>
    )
}

export default SuperAdminLayout