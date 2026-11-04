<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\EnquiryReceived;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * The quote and contact forms post here. Nothing is stored: the enquiry goes straight to the
 * company inbox, with Reply-To set to the visitor so a reply reaches them.
 */
class EnquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Bots fill every field. People never see this one.
        if (filled($request->input('website'))) {
            return response()->json(['ok' => true], 202);
        }

        $data = $request->validate([
            'kind' => ['required', 'in:quote,contact'],
            'name' => ['required', 'string', 'max:80'],
            'email' => ['required', 'string', 'email:rfc', 'max:120'],
            'phone' => ['required', 'string', 'regex:/^\+?[0-9 ()-]{7,20}$/'],
            'business' => ['nullable', 'string', 'max:80'],
            'message' => ['required', 'string', 'max:4000'],
        ], [
            'phone.regex' => 'Please enter a valid mobile number.',
        ]);

        try {
            Mail::to(config('mail.enquiries_to'))->send(new EnquiryReceived($data));
        } catch (Throwable $exception) {
            Log::error('Enquiry email failed', ['error' => $exception->getMessage()]);

            return response()->json(['message' => 'We could not send your request right now.'], 503);
        }

        return response()->json(['ok' => true], 202);
    }
}
