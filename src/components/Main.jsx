import React from 'react'
import Cadastro from './Cadastro'
import Tabela from './Tabela'

const Main = () => {

    return (
        <main className='px-10 py-5 flex gap-4 nav'>
            <Cadastro />

            <Tabela />
        </main>
    )
}

export default Main