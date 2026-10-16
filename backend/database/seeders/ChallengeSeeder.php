<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\ChallengeAttempt;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
    public function run(): void
    {
        $challenges = [
            'htmlcss-base' => [
                'title' => 'Quick Check: HTML Structure',
                'instruction' => 'Write a basic <h1> tag with the text "Hello World" to confirm your understanding.',
                'starter_code' => '<h1>Hello World</h1>',
                'placeholder' => 'Write your heading here',
                'rules' => [
                    ['all_of' => ['<h1', '</h1>'], 'failure_title' => 'Missing <h1> element', 'failure_description' => 'Wrap the heading in an opening <h1> and a closing </h1> tag.'],
                    ['all_of' => ['hello world'], 'failure_title' => 'Heading text missing', 'failure_description' => 'The <h1> has to contain the text "Hello World".'],
                ],
                'success_title' => 'Quick check passed',
                'success_description' => 'Your heading matches the expected structure.',
            ],
            'react-ui' => [
                'title' => 'React UI Challenge',
                'instruction' => 'Declare a state variable called "count"',
                'starter_code' => 'const [count, setCount] = useState(0)',
                'placeholder' => 'Write your state declaration',
                'rules' => [
                    ['all_of' => ['usestate'], 'failure_title' => 'useState not found', 'failure_description' => 'The task asks for a useState declaration. Add one and submit again.'],
                    ['all_of' => ['count'], 'failure_title' => 'State variable missing', 'failure_description' => 'Name the state variable "count".'],
                ],
                'success_title' => 'Task accepted',
                'success_description' => 'Your micro-task passed the automated check.',
            ],
            'nodejs-backend' => [
                'title' => 'Node.js Backend Challenge',
                'instruction' => 'Write an Express route that handles GET requests to "/" and responds with the text "Hello API".',
                'starter_code' => "app.get('/', (req, res) => {\n  res.send('Hello API')\n})",
                'placeholder' => 'Write your Express route',
                'rules' => [
                    ['all_of' => ['.get('], 'failure_title' => 'Missing GET route', 'failure_description' => 'Use app.get("/", ...) to handle GET requests to the root path.'],
                    ['any_of' => ['res.send', 'res.json'], 'failure_title' => 'No response sent', 'failure_description' => 'The route has to send a response.'],
                    ['all_of' => ['hello api'], 'failure_title' => 'Response text missing', 'failure_description' => 'The route has to respond with the text "Hello API".'],
                ],
                'success_title' => 'Route accepted',
                'success_description' => 'Your route passed the automated check.',
            ],
        ];

        foreach ($challenges as $missionSlug => $attributes) {
            Challenge::updateOrCreate(['slug' => $missionSlug], ['mission_slug' => $missionSlug, ...$attributes]);
        }

        foreach (['html-css-base' => 'htmlcss-base', 'node-js-backend' => 'nodejs-backend'] as $legacySlug => $currentSlug) {
            $legacy = Challenge::query()->where('slug', $legacySlug)->first();
            $current = Challenge::query()->where('slug', $currentSlug)->first();

            if (! $legacy || ! $current || $legacy->is($current)) {
                continue;
            }

            ChallengeAttempt::query()->where('challenge_id', $legacy->id)->update(['challenge_id' => $current->id]);

            if (! ChallengeAttempt::query()->where('challenge_id', $legacy->id)->exists()) {
                $legacy->delete();
            }
        }
    }
}
