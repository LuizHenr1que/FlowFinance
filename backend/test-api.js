const testAPI = async () => {
  try {
    // Primeiro, teste simples GET
    console.log('Testando GET /...');
    const getResponse = await fetch('http://localhost:3001/');
    console.log('GET Status:', getResponse.status);
    const getText = await getResponse.text();
    console.log('GET Response:', getText);

    // Depois teste POST /users
    console.log('\nTestando POST /users...');
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'teste',
        email: 'luiz@gmail.com',
        password: '12345678Test@'
      }),
    });

    const data = await response.json();
    console.log('POST Status:', response.status);
    console.log('POST Response:', data);
  } catch (error) {
    console.error('Erro:', error.message);
  }
};

testAPI();
