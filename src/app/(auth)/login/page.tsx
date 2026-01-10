import Link from 'next/link'
import React from 'react'

export default function LoginPage() {
  return (
    <div>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
    </div>
  )
}
