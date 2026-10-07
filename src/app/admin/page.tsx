export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Paneli</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-600">Aktiv Pasiyent</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">4</p>
          <p className="text-sm text-gray-600">Həkim</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600">Aktiv Alarm</p>
        </div>
      </div>
      <h2 className="text-lg font-bold mb-4">İstifadəçilər</h2>
      <table className="w-full border rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Ad</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Rol</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "Dr. House",     email: "doctor@test.com",    role: "DOCTOR",    status: "Aktiv" },
            { name: "John Doe",      email: "patient@test.com",   role: "PATIENT",   status: "Aktiv" },
            { name: "Receptionist",  email: "reception@test.com", role: "RECEPTION", status: "Aktiv" },
          ].map((u, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{u.role}</span></td>
              <td className="p-3"><span className="text-green-600 font-medium">● {u.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
