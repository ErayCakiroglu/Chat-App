import './App.css'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <h1>Hello world!</h1>
      <SignedOut>
        <SignInButton></SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton></UserButton>
      </SignedIn>
    </>
  )
}

export default App
