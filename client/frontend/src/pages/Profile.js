import '../stylesheets/index.css'
import '../stylesheets/profile.css'

export default function Profile() {
  return (<section className='main-container'>
    <Left/>
  </section>)
}

function Left(){
  const getUsername = () => {
    return 'michelle.lieberwoman'
  };
  return (<section>
    <h2>My Account</h2>
    <p>{getUsername()}</p>
  </section>);
}