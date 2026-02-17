'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from "@/components/ui/sidebar";
import { useEvent } from "@/context/EventContext";
import AddCircuitDialog from "../circuits/AddCircuitDialog";
import EditCircuitDialog from "../circuits/EditCircuitDialog";
import { Separator } from "@/components/ui/separator";
import EventSwitcher from "./EventSwitcher";
import { Trash2, GitFork, HardDrive } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function CircuitSidebar() {
    const { activeEvent, activeCircuit, activeView, dispatch } = useEvent();

    const handleCircuitSelect = (circuitId: string) => {
        dispatch({ type: 'SET_ACTIVE_CIRCUIT', payload: { circuitId } });
    }

    const handleViewSelect = (view: 'nodes' | 'equipment') => {
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: { view } });
    }

    const handleCircuitDelete = (circuitId: string) => {
        dispatch({ type: 'DELETE_CIRCUIT', payload: { circuitId } });
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <EventSwitcher />
            </SidebarHeader>
            <Separator />
            {activeEvent && (
                <>
                    <SidebarContent>
                        <SidebarMenu>
                            {activeEvent.circuits.map(circuit => (
                                <SidebarMenuItem key={circuit.id}>
                                    <SidebarMenuButton
                                        isActive={activeView === 'circuit' && circuit.id === activeCircuit?.id}
                                        onClick={() => handleCircuitSelect(circuit.id)}
                                    >
                                        {circuit.name}
                                    </SidebarMenuButton>

                                    <EditCircuitDialog circuit={circuit} />

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <SidebarMenuAction showOnHover>
                                                <Trash2 className="text-destructive" />
                                            </SidebarMenuAction>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the 
                                                    circuit "{circuit.name}" and all of its services.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button 
                                                        variant="destructive"
                                                        onClick={() => handleCircuitDelete(circuit.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                        <Separator className="my-2" />
                        <SidebarMenu>
                             <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeView === 'nodes'}
                                    onClick={() => handleViewSelect('nodes')}
                                >
                                    <GitFork />
                                    <span>Nodes</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={activeView === 'equipment'}
                                    onClick={() => handleViewSelect('equipment')}
                                >
                                    <HardDrive />
                                    <span>Equipment</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                        <AddCircuitDialog />
                    </SidebarFooter>
                </>
            )}
        </Sidebar>
    );
}
