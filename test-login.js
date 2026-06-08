async function test() {
  const payload = {
    username: "admin_camp1",
    password: "wrong_password",
    campId: 1
  };

  try {
    console.log('Sending wrong password to remote server...');
    const res = await fetch('https://endmgmt-api.pentadev.engineer/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Response Status:', res.status);
    const text = await res.text();
    console.log('Response Body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

test();
