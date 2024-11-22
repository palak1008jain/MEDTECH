function selectRole(role) {
    const doctorOption = document.getElementById('doctorOption');
    const patientOption = document.getElementById('patientOption');
    const doctorFields = document.getElementById('doctorFields');
    const emailField = document.getElementById('emailField').querySelector('input');

    if (role === 'doctor') {
        // Highlight Doctor
        doctorOption.classList.add('selected');
        patientOption.classList.remove('selected');
        
        // Show Doctor's Official Email and Department
        doctorFields.style.display = 'block';
        emailField.placeholder = 'Official Email';
    } else {
        // Highlight Patient
        patientOption.classList.add('selected');
        doctorOption.classList.remove('selected');
        
        // Hide Doctor's fields and show basic Email field
        doctorFields.style.display = 'none';
        emailField.placeholder = 'Email';
    }
}

// Password matching and form submission logic
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const password = document.querySelector('input[placeholder="Create Password"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
    } else {
        showSuccessMessage();
    }
});

// Fingerprint scanning logic
document.getElementById('fingerprintBtn').addEventListener('click', async function() {
    try {
        // Request USB device (fingerprint scanner)
        const device = await navigator.usb.requestDevice({
            filters: [{ vendorId: 0x1234 }]  // Replace with your scanner's vendorId
        });

        await device.open(); // Open device
        await device.selectConfiguration(1); // Select configuration
        await device.claimInterface(0); // Claim interface

        const data = new Uint8Array(64);  // Modify based on scanner's output size
        const result = await device.transferIn(1, data.length);

        if (result.data) {
            const fingerprint = result.data.buffer; // Capture fingerprint data
            // Display fingerprint
            document.getElementById('result').textContent = "Fingerprint captured!";
            document.getElementById('fingerprintImage').src = URL.createObjectURL(new Blob([fingerprint]));
            document.getElementById('fingerprintImage').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('result').textContent = "Error: " + error.message;
    }
});

function showSuccessMessage() {
    const container = document.querySelector('.container');
    
    container.innerHTML = `
        <h2>Registration Successful!</h2>
        <p>Your registration was successful. Click the link below to return to the login page.</p>
        <a href="login.html">Go back to Login</a>
    `;
}
