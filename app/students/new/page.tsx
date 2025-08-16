import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getDefaultPrice() {
  const s = await prisma.setting.findFirst();
  return s?.defaultPriceCents ?? 0;
}

export default async function NewStudentPage() {
  const defaultPrice = await getDefaultPrice();
  return (
    <main className="max-w-2xl bg-white border rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Register Student</h2>
      <form className="space-y-4" action={createStudent} id="studentForm">
        <div>
          <label>Name</label>
          <input name="name" required />
        </div>
        <div>
          <label>ID Card Number</label>
          <input name="idCardNumber" required />
        </div>
        <div>
          <label>Contact</label>
          <input name="contact" required />
        </div>
        <div>
          <label>Address</label>
          <input name="address" required />
        </div>
        <div>
          <label>License Category</label>
          <select name="licenseCategory" required id="licenseCategory">
            <option value="">Select a category</option>
            <option value="A">A</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="BE">BE</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the license category you want to obtain
          </p>
        </div>
        <div>
          <label>Already Passed Exams</label>
          <div className="text-sm text-gray-600 mb-2">
            Select all exam categories you have already passed
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="passedExams"
                value="A"
                className="passed-exam"
              />
              <span>Category A</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="passedExams"
                value="C"
                className="passed-exam"
              />
              <span>Category C</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="passedExams"
                value="D"
                className="passed-exam"
              />
              <span>Category D</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="passedExams"
                value="BE"
                className="passed-exam"
              />
              <span>Category BE</span>
            </label>
          </div>
        </div>
        <div>
          <label>Agreed Price (SRD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={(defaultPrice / 100).toFixed(2)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>

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
    </main>
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
