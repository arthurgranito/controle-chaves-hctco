import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { addDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Button } from './ui/button';

const Cadastro = () => {
    const [matricula, setMatricula] = useState("");
    const [chave, setChave] = useState("");

    const regexChave = /^[FM][0-9]{1,3}$/;

    const chaveJaRegistrada = async (chave) => {
        const q = query(collection(db, 'registros'), where('chave', '==', chave));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }

    const confirmarRetirada = async () => {
        if (!matricula || !chave) {
            Toastify({
                text: "Preencha todos os campos necessários!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "#fb2c36",
                },
            }).showToast();
        } else if (!regexChave.test(chave)) {
            Toastify({
                text: "A chave deve ser ou F ou M seguida de até 3 dígitos!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "#fb2c36",
                },
            }).showToast();
        } else {
            const chaveExistente = await chaveJaRegistrada(chave);

            if(chaveExistente){
                Toastify({
                    text: "Essa chave já está sendo utilizada!",
                    duration: 3000,
                    close: true,
                    gravity: "bottom",
                    position: "left",
                    stopOnFocus: true,
                    style: {
                        background: "#fb2c36",
                    },
                }).showToast();
                return;
            }

            await addDoc(collection(db, "registros"), {
                matricula: matricula,
                chave: chave,
                dataRetirada: serverTimestamp(),
            })

            setMatricula("");
            setChave("");

            Toastify({
                text: "Chave entregue com sucesso!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "#007f71",
                },
            }).showToast();
        }
    }

    return (
        <Card className='w-[70%] h-full cadastro'>
            <CardHeader>
                <CardTitle>Cadastro de entrega de chaves</CardTitle>
                <CardDescription>
                    Preencha com os dados necessários para cadastrar a entrega de uma chave a um funcionário
                </CardDescription>
            </CardHeader>
            <form className='flex flex-col gap-4' onSubmit={(e) => {
                e.preventDefault();
                confirmarRetirada();
            }}>
                <CardContent className='space-y-2'>
                    <div className="space-y-1">
                        <Label htmlFor='matricula'>Matrícula</Label>
                        <Input id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value.toUpperCase())}/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="numeroChave">Número da chave</Label>
                        <Input id="numeroChave" value={chave} onChange={(e) => setChave(e.target.value.toUpperCase())} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type='submit' className='cursor-pointer bg-[#007f71] hover:bg-[#079484]'>Registrar entrega da chave</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default Cadastro