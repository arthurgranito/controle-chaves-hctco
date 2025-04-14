import logo from '../img/HCTCO Logo.png';

const Nav = () => {
  return (
    <nav className='p-4 py-5 border-b flex items-center justify-between'>
        <h1 className='font-bold text-2xl'>Entrega de Chaves | HCTCO</h1>
        <img src={logo} alt="Logo HCTCO" className='w-28'/>
    </nav>
  )
}

export default Nav