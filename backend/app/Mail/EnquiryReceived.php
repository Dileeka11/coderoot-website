<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/** A plain-text email, so nothing the visitor typed is ever rendered as HTML. */
class EnquiryReceived extends Mailable
{
    /**
     * @param  array{kind: string, name: string, email: string, phone: string, business?: ?string, message: string}  $enquiry
     */
    public function __construct(public array $enquiry) {}

    public function envelope(): Envelope
    {
        $name = $this->oneLine($this->enquiry['name']);
        $label = $this->enquiry['kind'] === 'quote' ? 'Quote request' : 'Message';

        return new Envelope(
            replyTo: [new Address($this->enquiry['email'], $name)],
            subject: "{$label} from {$name}",
        );
    }

    public function content(): Content
    {
        return new Content(text: 'mail.enquiry', with: [
            'name' => $this->oneLine($this->enquiry['name']),
            'business' => $this->oneLine($this->enquiry['business'] ?? ''),
            'email' => $this->enquiry['email'],
            'phone' => $this->oneLine($this->enquiry['phone']),
            'body' => $this->enquiry['message'],
        ]);
    }

    private function oneLine(string $value): string
    {
        return trim(preg_replace('/\s+/', ' ', $value) ?? '');
    }
}
