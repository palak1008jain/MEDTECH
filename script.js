// Example patient data
const patients = [
  { name: 'John Doe', lastVisit: '2024-08-25', history: 'Details of medical history...' },
  { name: 'Jane Smith', lastVisit: '2024-08-15', history: 'Details of medical history...' }
];

// Function to display all patients on page load
window.onload = function() {
  displayAllPatients();

  // Add event listeners for patient and doctor fingerprint buttons
  document.getElementById('patientFingerprintBtn').addEventListener('click', function() {
    scanFingerprint('patient');
  });

  document.getElementById('doctorFingerprintBtn').addEventListener('click', function() {
    scanFingerprint('doctor');
  });
};

// Function to filter and display patients based on last visit
function filterPatients() {
  const filterDate = document.getElementById('filter').value;
  const filteredPatients = patients.filter(patient => patient.lastVisit >= filterDate);
  const tableBody = document.querySelector('#patient-table tbody');

  tableBody.innerHTML = '';

  if (filteredPatients.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3">No patients found for the selected date.</td></tr>';
  } else {
    filteredPatients.forEach(patient => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${patient.name}</td>
        <td>${patient.lastVisit}</td>
        <td>${patient.history}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}

// Function to display all patients
function displayAllPatients() {
  const tableBody = document.querySelector('#patient-table tbody');
  tableBody.innerHTML = '';

  patients.forEach(patient => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${patient.name}</td>
      <td>${patient.lastVisit}</td>
      <td>${patient.history}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Fingerprint scanning logic
let patientAuthenticated = false;

async function scanFingerprint(userType) {
  const fingerprintStatus = document.getElementById('fingerprint-status');

  if (userType === 'doctor' && !patientAuthenticated) {
    alert("Please authenticate the patient’s fingerprint first.");
    return;
  }

  try {
    // Request USB device (fingerprint scanner)
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x1234 }]  // Replace with your scanner's vendorId
    });

    console.log('Device requested:', device); // Debugging line

    await device.open(); // Open device
    await device.selectConfiguration(1); // Select configuration
    await device.claimInterface(0); // Claim interface

    console.log('Device opened and interface claimed'); // Debugging line

    const data = new Uint8Array(64);  // Modify based on scanner's output size
    const result = await device.transferIn(1, data.length);

    if (result.data) {
      const fingerprint = result.data.buffer; // Capture fingerprint data
      // Display fingerprint authentication based on user type
      fingerprintStatus.innerHTML = userType === 'patient'
        ? "Patient fingerprint authenticated."
        : "Doctor fingerprint authenticated.";

      // Update authentication status
      if (userType === 'patient') {
        patientAuthenticated = true;
        document.getElementById('doctorFingerprintBtn').disabled = false; // Enable doctor scan button
      }

      // Proceed with further actions (e.g., loading patient records)
      if (userType === 'doctor') {
        loadPatientRecords();
      }
    } else {
      throw new Error("Failed to capture fingerprint data.");
    }
  } catch (error) {
    // Show error popup if the device is not connected or any issue occurs
    alert("No compatible device found or error: " + error.message);
    fingerprintStatus.innerHTML = `Error scanning ${userType} fingerprint.`;
    console.error('Error:', error); // Debugging line
  }
}

// Function to load patient records once both fingerprints are authenticated
function loadPatientRecords() {
  alert("Both fingerprints verified. Accessing patient records...");
  // You would fetch the patient's medical history here
}
