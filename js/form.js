// DOM Elements
const modeToggle = document.getElementById("mode-toggle");
const pengajuanForm = document.getElementById("pengajuanForm");
const hasilDiv = document.getElementById("hasil");

// Dark Mode Functionality
if (modeToggle) {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    updateModeToggle("dark");
  }

  // Toggle theme on button click
  modeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateModeToggle(newTheme);
  });
}

function updateModeToggle(theme) {
  const modeIcon = modeToggle.querySelector(".mode-icon");
  const modeText = modeToggle.querySelector(".mode-text");

  if (theme === "dark") {
    modeIcon.textContent = "";
    modeText.textContent = "Mode Terang";
  } else {
    modeIcon.textContent = "";
    modeText.textContent = "Mode Gelap";
  }
}

// Form Validation and Submission
if (pengajuanForm) {
  // Field validators
  const validators = {
    nama: (value) => {
      if (value.trim().length < 3) {
        return { valid: false, message: "Nama harus minimal 3 karakter" };
      }
      return { valid: true };
    },
    nik: (value) => {
      if (!/^\d{16}$/.test(value)) {
        return { valid: false, message: "NIK harus 16 digit angka" };
      }
      return { valid: true };
    },
    layanan: (value) => {
      if (!value) {
        return { valid: false, message: "Silakan pilih jenis layanan" };
      }
      return { valid: true };
    },
    alasan: (value) => {
      if (value.trim().length < 10) {
        return { valid: false, message: "Alasan harus minimal 10 karakter" };
      }
      return { valid: true };
    },
  };

  // Add event listeners for real-time validation
  Object.keys(validators).forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    const errorId = `${fieldName}-error`;
    const errorElement = document.getElementById(errorId);

    field.addEventListener("input", () => {
      validateField(field, errorElement, validators[fieldName]);
    });

    field.addEventListener("blur", () => {
      validateField(field, errorElement, validators[fieldName]);
    });
  });

  // Validate field function
  function validateField(field, errorElement, validator) {
    const validation = validator(field.value);

    if (!validation.valid && field.value.length > 0) {
      field.classList.add("invalid");
      errorElement.textContent = validation.message;
      return false;
    } else if (field.required && field.value.length === 0) {
      field.classList.remove("invalid");
      errorElement.textContent = "";
      return false;
    } else {
      field.classList.remove("invalid");
      errorElement.textContent = "";
      return true;
    }
  }

  // Form submission handler
  pengajuanForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    const validationResults = {};

    Object.keys(validators).forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      const errorId = `${fieldName}-error`;
      const errorElement = document.getElementById(errorId);

      const isValid = validateField(field, errorElement, validators[fieldName]);
      if (!isValid) {
        isFormValid = false;
      }

      // Store field values
      validationResults[fieldName] = field.value;
    });

    if (isFormValid) {
      // Display submission result
      displaySubmissionResult(validationResults);

      // Reset form
      pengajuanForm.reset();

      // Scroll to result
      hasilDiv.scrollIntoView({ behavior: "smooth" });
    } else {
      // Show error message
      hasilDiv.innerHTML = `
        <div class="error-message">
          <p>❌ Silakan perbaiki kesalahan pada formulir sebelum mengajukan.</p>
        </div>
      `;
      hasilDiv.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Display submission result
  function displaySubmissionResult(data) {
    const serviceNames = {
      KTP: "KTP Elektronik",
      KK: "Kartu Keluarga",
      "Akta Kelahiran": "Akta Kelahiran",
      "Akta Kematian": "Akta Kematian",
    };

    hasilDiv.innerHTML = `
      <h3>✅ Pengajuan Berhasil Diterima</h3>
      <div class="result-details">
        <p><strong>Nama Pemohon:</strong> ${data.nama}</p>
        <p><strong>Nomor Induk Kependudukan:</strong> ${data.nik}</p>
        <p><strong>Jenis Layanan:</strong> ${
          serviceNames[data.layanan] || data.layanan
        }</p>
        <p><strong>Alasan Pengajuan:</strong></p>
        <p class="alasan-text">${data.alasan}</p>
      </div>
      <div class="next-steps">
        <h4>Proses Selanjutnya:</h4>
        <ol>
          <li>Datang ke kantor Disdukcapil dengan membawa dokumen asli</li>
          <li>Lakukan verifikasi data dengan petugas</li>
          <li>Tunggu proses penerbitan dokumen</li>
        </ol>
      </div>
      <p class="contact-note">Untuk pertanyaan lebih lanjut, silakan hubungi kami melalui kontak yang tersedia.</p>
    `;
  }
}
