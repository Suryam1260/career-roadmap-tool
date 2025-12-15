import React, { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRequestCallback } from '../../app/context/RequestCallbackContext';

const Input = ({ label, type = 'text', value, onChange, placeholder, name, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}{required ? ' *' : ''}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

const TextArea = ({ label, value, onChange, placeholder, name }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

const SuccessState = ({ onClose }) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Request received</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Our team will reach out shortly. Thanks for your interest!
      </p>
      <div className="flex justify-end">
        <button onClick={onClose} className="btn btn-primary">Close</button>
      </div>
    </div>
  );
};

const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-4 border border-red-300 bg-red-50 text-red-800 px-3 py-2 text-sm">
      {message}
    </div>
  );
};

const RequestCallbackModal = () => {
  const {
    isOpen,
    isSubmitting,
    submitError,
    submitSuccess,
    defaults,
    closeRequestCallback,
    submitRequest
  } = useRequestCallback();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  // Prefill when opened
  useEffect(() => {
    if (isOpen) {
      setName(defaults?.name || '');
      setEmail(defaults?.email || '');
      setPhone(defaults?.phone || '');
      setNote(defaults?.note || '');
    }
  }, [isOpen, defaults]);

  const canSubmit = useMemo(() => {
    // Require at least one contact method
    return Boolean((email && email.includes('@')) || (phone && phone.length >= 7));
  }, [email, phone]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    await submitRequest({
      name: name?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      note: note?.trim()
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => { if (!o) closeRequestCallback(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 bg-card text-card-foreground border border-border shadow-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {!submitSuccess ? (
            <form onSubmit={onSubmit} className="p-6">
              <Dialog.Title className="text-xl font-semibold mb-1">Request a callback</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground mb-4">
                Share your contact details and we’ll get in touch.
              </Dialog.Description>

              <ErrorBanner message={submitError} />

              <Input
                label="Full name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />

              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0123"
              />

              <TextArea
                label="Notes (optional)"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your goals or questions…"
              />

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div>
                  {defaults?.source ? <span>Source: {defaults.source}</span> : <span />}
                </div>
                <div>
                  {/* reserved for small hints */}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button type="button" className="btn btn-secondary" disabled={isSubmitting}>
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Request callback'}
                </button>
              </div>
            </form>
          ) : (
            <SuccessState onClose={closeRequestCallback} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RequestCallbackModal;


