import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "./ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from "./ui/dialog"
import { Search } from 'lucide-react'
import { collection, query, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'

const Tabela = () => {
    const [chaves, setChaves] = useState([]);
    const [pesquisaChave, setPesquisaChave] = useState('');

    const buscarChave = () => {
        return;
    }

    useEffect(() => {
        const q = query(collection(db, "registros"), orderBy("dataRetirada", "desc"));

        const chavesEntregues = onSnapshot(q, (snapshot) => {
            const registros = snapshot.docs.map((doc) => {
                const dataJS = doc.data().dataRetirada?.toDate();

                return {
                    id: doc.id,
                    ...doc.data(),
                    dataFormatada: dataJS?.toLocaleDateString("pt-BR"),
                    horaFormatada: dataJS?.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };
            });

            setChaves(registros);
        });
        return () => chavesEntregues();
    }, []);

    const devolucaoChave = async (id) => {
        try {
            await deleteDoc(doc(db, "registros", id));

            setChaves((prevChaves) => prevChaves.filter((chave) => chave.id !== id));

            Toastify({
                text: "Chave devolvida com sucesso!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "#007f71"
                }
            }).showToast();
        } catch (error) {
            console.error("Erro ao remover a chave: ", error);
            Toastify({
                text: "Erro ao remover a chave!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "f44336"
                }
            }).showToast();
        }
    }

    return (
        <Card className='w-full'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle>
                        Tabela de Chaves Entregues
                    </CardTitle>
                    <CardDescription>
                        <form className='flex gap-3' onSubmit={(e) => {
                            e.preventDefault();
                            buscarChave();
                        }}>
                            <Input placeholder="Pesquise por uma chave" className='w-50' value={pesquisaChave} onChange={(e) => setPesquisaChave(e.target.value)}/>
                            <Button className='w-9 h-9 cursor-pointer bg-[#007f71] hover:bg-[#079484]' type='submit'>
                                <Search />
                            </Button>
                        </form>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className='space-y-2'>
                <Table>
                    <TableCaption>Lista com as chaves que ainda não foram devolvidas.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[100px]'>Data</TableHead>
                            <TableHead>Hora</TableHead>
                            <TableHead>Matrícula</TableHead>
                            <TableHead>Chave</TableHead>
                            <TableHead>Devolução</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {chaves.map((chave) => (
                            <TableRow key={chave.id}>
                                <TableCell className='font-medium'>{chave.dataFormatada}</TableCell>
                                <TableCell>{chave.horaFormatada}</TableCell>
                                <TableCell>{chave.matricula}</TableCell>
                                <TableCell>{chave.chave}</TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className='cursor-pointer w-[100%] bg-[#007f71] hover:bg-[#079484]'>Confirmar devolução</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Devolução de Chave
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Deseja confirmar que o funcionário devolveu a chave?
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className='grid grid-cols-2'>
                                                <DialogClose asChild>
                                                    <Button variant='destructive' className='w-full cursor-pointer'>Cancelar devolução</Button>
                                                </DialogClose>

                                                <DialogClose asChild>
                                                    <Button className='w-full cursor-pointer bg-[#007f71] hover:bg-[#079484]' onClick={() => devolucaoChave(chave.id)}>Confirmar devolução</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4}>Total de chaves</TableCell>
                            <TableCell className='text-right'>{chaves.length}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Tabela