<?php

namespace Tests\Feature;

use App\Mail\EnquiryReceived;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EnquiryApiTest extends TestCase
{
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'kind' => 'quote',
            'name' => 'Nimal Perera',
            'email' => 'nimal@example.com',
            'phone' => '077 123 4567',
            'business' => 'Perera Stores',
            'message' => "Hi CodeRoot, I'd like a website.",
        ], $overrides);
    }

    public function test_enquiry_is_emailed_to_the_company_inbox(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/enquiries', $this->payload())->assertStatus(202);

        Mail::assertSent(EnquiryReceived::class, function (EnquiryReceived $mail) {
            return $mail->hasTo('info@coderootsolutions.com')
                && $mail->hasReplyTo('nimal@example.com')
                && $mail->hasSubject('Quote request from Nimal Perera');
        });
    }

    public function test_email_body_has_the_contact_details(): void
    {
        $text = (new EnquiryReceived($this->payload()))->render();

        $this->assertStringContainsString('Mobile: 077 123 4567', $text);
        $this->assertStringContainsString('Email: nimal@example.com', $text);
        $this->assertStringContainsString("I'd like a website.", $text);
    }

    public function test_email_and_mobile_are_required_and_checked(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/enquiries', $this->payload(['email' => 'not-an-email', 'phone' => 'abc']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'phone']);

        $this->postJson('/api/v1/enquiries', $this->payload(['email' => '', 'phone' => '']))
            ->assertJsonValidationErrors(['email', 'phone']);

        Mail::assertNothingSent();
    }

    public function test_line_breaks_in_the_name_do_not_reach_the_subject(): void
    {
        $mail = new EnquiryReceived($this->payload(['name' => "Nimal\r\nBcc: x@example.com"]));

        $this->assertSame('Quote request from Nimal Bcc: x@example.com', $mail->envelope()->subject);
    }

    public function test_honeypot_submissions_are_dropped_quietly(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/enquiries', $this->payload(['website' => 'http://spam.example']))->assertStatus(202);

        Mail::assertNothingSent();
    }

    public function test_enquiries_are_rate_limited(): void
    {
        Mail::fake();

        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/v1/enquiries', $this->payload())->assertStatus(202);
        }

        $this->postJson('/api/v1/enquiries', $this->payload())->assertTooManyRequests();
    }
}
