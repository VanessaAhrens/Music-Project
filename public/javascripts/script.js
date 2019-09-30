document.addEventListener('DOMContentLoaded', () => {

  console.log('Ironhack yeha');

  const button = document.getElementById('Register');
  button.addEventListener('click', function(e) {
    console.log('button was clicked');
    const editForm = document.getElementById('signup-form');
    editForm.style.color="red"
  
  });

}, false);
