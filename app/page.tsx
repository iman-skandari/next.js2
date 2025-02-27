import UserList from './UserList'

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-gray-100">
      <div className="py-8">
        <UserList />
      </div>
    </main>
  )
}