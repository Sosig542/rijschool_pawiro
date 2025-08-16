import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getDefaultPrice() {
  const s = await prisma.setting.findFirst();
  return s?.defaultPriceCents ?? 0;
}

export default async function NewStudentPage() {
  const defaultPrice = await getDefaultPrice();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Register New Student
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add a new student to your driving school system
            </p>
          </div>
          <form
            className="p-6 space-y-6"
            action={createStudent}
            id="studentForm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter student's full name"
                />
              </div>
              <div>
                <label
                  htmlFor="idCardNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ID Card Number
                </label>
                <input
                  id="idCardNumber"
                  name="idCardNumber"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter ID card number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Number
                </label>
                <input
                  id="contact"
                  name="contact"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Agreed Price (SRD)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={(defaultPrice / 100).toFixed(2)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter student's address"
              />
            </div>

            <div>
              <label
                htmlFor="licenseCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                License Category
              </label>
              <select
                id="licenseCategory"
                name="licenseCategory"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="A">Category A</option>
                <option value="C">Category C</option>
                <option value="D">Category D</option>
                <option value="BE">Category BE</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select the license category you want to obtain
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Already Passed Exams
              </label>
              <div className="text-sm text-gray-600 mb-3">
                Select all exam categories you have already passed
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="passedExams"
                    value="A"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Category A
                  </span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="passedExams"
                    value="C"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Category C
                  </span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="passedExams"
                    value="D"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Category D
                  </span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name="passedExams"
                    value="BE"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Category BE
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Student
              </button>
            </div>
          </form>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('studentForm');
            const licenseSelect = document.getElementById('licenseCategory');
            const passedExams = document.querySelectorAll('.passed-exam');
            
            function updateLicenseOptions() {
              const selectedPassedExams = Array.from(passedExams)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
              
              Array.from(licenseSelect.options).forEach(option => {
                if (option.value && selectedPassedExams.includes(option.value)) {
                  option.disabled = true;
                  option.textContent = option.value + ' (Already Passed)';
                } else if (option.value) {
                  option.disabled = false;
                  option.textContent = option.value;
                }
              });
            }
            
            passedExams.forEach(cb => cb.addEventListener('change', updateLicenseOptions));
            updateLicenseOptions();
            
            form.addEventListener('submit', function(e) {
              const selectedLicense = licenseSelect.value;
              const selectedPassedExams = Array.from(passedExams)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
              
              if (selectedPassedExams.includes(selectedLicense)) {
                e.preventDefault();
                alert('You cannot select a license category that you have already passed. Please choose a different category.');
                return false;
              }
            });
          });
        `,
        }}
      />
    </div>
  );
}

async function createStudent(formData: FormData) {
  "use server";
  const name = String(formData.get("name"));
  const idCardNumber = String(formData.get("idCardNumber"));
  const contact = String(formData.get("contact"));
  const address = String(formData.get("address"));
  const licenseCategory = String(formData.get("licenseCategory"));
  const price = Math.round(
    parseFloat(String(formData.get("price") ?? "0")) * 100
  );

  // Get all selected passed exams
  const passedExams = formData.getAll("passedExams") as string[];

  // Server-side validation
  if (passedExams.includes(licenseCategory)) {
    throw new Error("Cannot select a license category that is already passed");
  }

  await prisma.student.create({
    data: {
      name,
      idCardNumber,
      contact,
      address,
      licenseCategory,
      agreedPriceCents: price,
      passedExams,
    },
  });
  redirect("/students");
}
