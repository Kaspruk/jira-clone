'use client';

import React, { useSyncExternalStore } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

type ConfirmProps = Omit<React.ComponentProps<typeof ConfirmDialog>, 'open' | 'onOpenChange'>;

let confirmState: ConfirmProps & { open: boolean, resolve: (value?: unknown) => void } = {
    open: false,
    title: '',
    message: '',
    resolve: () => null,
};

const emitChange = () => { 
    listeners.forEach(listener => listener());
};

let listeners: (() => void)[] = [];

const subscribe = (listener: () => void) => {
    listeners = [...listeners, listener];
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
};

const getSnapshot = () => confirmState;

const onConfirm = (props: ConfirmProps) => {
    confirmState = {
        ...confirmState,
        title: '',
        message: '',
        cancelText: undefined,
        approveText: undefined,
        ...props,
        open: true,
    };

    const promise = new Promise(resolve => {
        confirmState.resolve = resolve;
    });

    emitChange();

    return promise;
};

const closeModal = () => {
    confirmState = {
        ...confirmState,
        open: false,
    };

    emitChange();
};

type ConfirmationType = React.FC & {
    onConfirm: typeof onConfirm;
};

export const Confirm: ConfirmationType = () => {
    const { resolve, ...modalProps } = useSyncExternalStore(subscribe, getSnapshot);

    const onClose = () => {
        resolve(false);
        closeModal();
    };
    const onApprove = () => {
        resolve(true);
        closeModal();
    };
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <ConfirmDialog
            {...modalProps}
            onClose={onClose}
            onApprove={onApprove}
            onOpenChange={handleOpenChange}
        />
    );
};

Confirm.onConfirm = onConfirm;
