import LoginPageComponent from "@/components/login";

// actual login page that uses the auth service to login call the index
export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center">
            <LoginPageComponent />
        </main>
    )
}