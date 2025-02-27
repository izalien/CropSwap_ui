export default function Header() {
  return (
    
    <header className='p-2 bg-secondary'>
      <nav className='navbar navbar-expand-lg'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='./'>Crop Swap</a>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse justify-content-end' id='navbarNav'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <a className='nav-link' aria-current='page' href='#'>My Fields</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>History</a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='#'>Planning</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    
  );
}