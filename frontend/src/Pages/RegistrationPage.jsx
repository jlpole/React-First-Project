import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(""); // ✅ added
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full px-3 py-2";
  const labelClass = "block mb-1 text-xs font-medium text-gray-700";

  // ✅ Auto-calculate age from dateOfBirth
  const handleDateOfBirthChange = (e) => {
    const dob = e.target.value;
    setDateOfBirth(dob);

    if (dob) {
      const today = new Date();
      const birth = new Date(dob);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) calculatedAge--;
      setAge(calculatedAge);
    } else {
      setAge("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/auth/register", {
        email, password, name, role: 'Owner',
        gender, dateOfBirth, age, // ✅ added age
        addressLine1, addressLine2,
        city, stateProvince, postalCode, country,
        contactNumber, alternateContact,
        emergencyContact, emergencyContactName, comment,
      });
      alert("Registration successful! Please login.");
      setTimeout(() => { setLoading(false); navigate('/login'); }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Owner Registration</h3>
            <p className="text-xs text-gray-500 mt-0.5">Fill up all required fields</p>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
            Owner
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6">

            {/* COLUMN 1 - Account Info */}
            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 pb-1.5 border-b border-gray-100">
                Account Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Juan Dela Cruz" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@company.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" className={inputClass} />
                  <p className="text-xs text-gray-400 mt-0.5">Minimum 6 characters</p>
                </div>
                <div>
                  <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} required className={inputClass}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  {/* ✅ Updated onChange */}
                  <input type="date" value={dateOfBirth} onChange={handleDateOfBirthChange} className={inputClass} />
                </div>
                {/* ✅ Age - auto calculated */}
                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    type="number"
                    value={age}
                    readOnly
                    placeholder="Auto-calculated"
                    className="bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg block w-full px-3 py-2 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-0.5">Auto-calculated from date of birth</p>
                </div>
              </div>
            </div>

            {/* COLUMN 2 - Address Info */}
            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 pb-1.5 border-b border-gray-100">
                Address Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Address Line 1 <span className="text-red-500">*</span></label>
                  <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required placeholder="Street, Barangay" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Apartment, Suite (optional)" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City <span className="text-red-500">*</span></label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Cagayan de Oro" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input type="text" value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="Misamis Oriental" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="9000" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Philippines" className={inputClass} />
                </div>
              </div>
            </div>

            {/* COLUMN 3 - Contact Info + Notes */}
            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 pb-1.5 border-b border-gray-100">
                Contact Information
              </h4>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required placeholder="09123456789" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Alternate Contact</label>
                  <input type="tel" value={alternateContact} onChange={(e) => setAlternateContact(e.target.value)} placeholder="09987654321" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Emergency Contact Number</label>
                  <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="09111111111" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Emergency Contact Name</label>
                  <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} placeholder="Maria Dela Cruz" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Additional Notes</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Any additional info... (optional)" className={inputClass} />
                </div>
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white bg-green-700 hover:bg-green-800 disabled:bg-yellow-300 disabled:cursor-not-allowed font-medium rounded-lg text-sm py-2.5 transition-colors"
            >
              {loading ? 'Registering...' : 'Register as Owner'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
            >
              Already have an account? Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;