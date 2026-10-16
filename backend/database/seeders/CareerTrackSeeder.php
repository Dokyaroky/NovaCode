<?php

namespace Database\Seeders;

use App\Models\CareerTrack;
use Illuminate\Database\Seeder;

class CareerTrackSeeder extends Seeder
{
    public function run(): void
    {
        $tracks = [
            'full-stack' => ['Full Stack Developer', 'Build complete products across modern front-end and back-end systems.', 'Final Boss: E-Commerce Capstone', ['HTML/CSS Base', 'React UI', 'Node.js Backend']],
            'front-end' => ['Front-End Engineer', 'Create accessible, responsive interfaces with modern web frameworks.', 'Final Boss: Portfolio Dashboard', ['HTML/CSS Base', 'JavaScript Essentials', 'React UI']],
            'back-end' => ['Back-End Developer', 'Design secure APIs, services, databases, and scalable infrastructure.', 'Final Boss: Inventory API', ['Node.js Backend', 'SQL & Data Modeling', 'API Security']],
            'cybersecurity' => ['Cybersecurity Analyst', 'Protect applications and investigate vulnerabilities across systems.', 'Final Boss: Security Audit Report', ['Networking Basics', 'Web Vulnerabilities', 'Secure Coding']],
            'data-scientist' => ['Data Scientist', 'Transform complex data into useful models, insights, and decisions.', 'Final Boss: Churn Prediction Model', ['Python Foundations', 'SQL & Data Modeling', 'Data Analysis']],
            'ai-engineer' => ['AI Engineer', 'Build intelligent products with machine learning and language models.', 'Final Boss: RAG Chatbot', ['Python Foundations', 'Machine Learning Basics', 'LLM Apps']],
        ];

        $sortOrder = 0;
        foreach ($tracks as $slug => [$title, $description, $bossTitle, $missions]) {
            $track = CareerTrack::updateOrCreate(['slug' => $slug], [
                'title' => $title,
                'description' => $description,
                'sort_order' => ++$sortOrder,
                'boss_title' => $bossTitle,
                'boss_reward_label' => '10,000L Rocket Fuel',
                'active' => true,
            ]);

            foreach ($missions as $index => $missionTitle) {
                $missionSlug = str($missionTitle)->slug();
                $theoryTitle = $missionTitle === 'HTML/CSS Base' ? 'Theory: HTML & CSS' : "Theory: {$missionTitle}";
                $extractionTitle = $missionTitle === 'HTML/CSS Base' ? 'Fuel Extraction: NavBar' : "Fuel Extraction: {$missionTitle}";
                $track->missions()->updateOrCreate(['slug' => $missionSlug], [
                    'title' => $missionTitle,
                    'sort_order' => $index + 1,
                    'theory_title' => $theoryTitle,
                    'theory_minutes' => 8,
                    'extraction_title' => $extractionTitle,
                    'reward_label' => '+500 XP and 200L Plasma Fuel',
                ]);
            }
        }
    }
}
